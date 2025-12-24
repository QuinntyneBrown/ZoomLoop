// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Text.RegularExpressions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Auth;

public partial class RegisterHandler : IRequestHandler<RegisterRequest, RegisterResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<RegisterHandler> _logger;

    public RegisterHandler(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        ILogger<RegisterHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing registration for email: {Email}", request.Email);

        if (!IsValidPassword(request.Password))
        {
            _logger.LogWarning("Password validation failed for registration: {Email}", request.Email);
            throw new InvalidOperationException("Password must be at least 8 characters with 1 uppercase letter and 1 number.");
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser != null)
        {
            _logger.LogWarning("Registration attempt with existing email: {Email}", request.Email);
            throw new InvalidOperationException("An account with this email already exists.");
        }

        var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User", cancellationToken);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            EmailVerified = true,
            EmailVerifiedAt = DateTime.UtcNow,
            Roles = userRole != null ? [userRole] : []
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User registered successfully: {UserId}, Email: {Email}", user.UserId, user.Email);

        return new RegisterResponse(user.UserId, user.Email, true);
    }

    private static bool IsValidPassword(string password)
    {
        if (password.Length < 8)
        {
            return false;
        }

        if (!UppercaseRegex().IsMatch(password))
        {
            return false;
        }

        if (!NumberRegex().IsMatch(password))
        {
            return false;
        }

        return true;
    }

    [GeneratedRegex("[A-Z]")]
    private static partial Regex UppercaseRegex();

    [GeneratedRegex("[0-9]")]
    private static partial Regex NumberRegex();
}
