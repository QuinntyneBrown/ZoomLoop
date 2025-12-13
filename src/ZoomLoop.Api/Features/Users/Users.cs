// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Security;

namespace ZoomLoop.Api.Features.Users;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CurrentProfileId = user.CurrentProfileId,
            DefaultProfileId = user.DefaultProfileId,
            IsDeleted = user.IsDeleted,
            Roles = user.Roles.Select(x => x.ToDto()).ToList()
        };
    }

    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name
        };
    }
}

public class RoleDto
{
    public Guid? RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid? UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<RoleDto> Roles { get; set; } = [];
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public bool IsDeleted { get; set; }
}

// Queries
public record GetUserByIdRequest(Guid UserId) : IRequest<GetUserByIdResponse>;
public class GetUserByIdResponse
{
    public UserDto? User { get; set; }
}

public record GetUsersRequest() : IRequest<GetUsersResponse>;
public class GetUsersResponse
{
    public List<UserDto> Users { get; set; } = [];
}

public record UsernameExistsRequest(string Username) : IRequest<UsernameExistsResponse>;
public class UsernameExistsResponse
{
    public bool Exists { get; set; }
}

public record GetUsersPageRequest(int PageSize, int Index) : IRequest<GetUsersPageResponse>;
public class GetUsersPageResponse
{
    public int Length { get; set; }
    public List<UserDto> Entities { get; set; } = [];
}

public record CurrentUserRequest() : IRequest<CurrentUserResponse>;
public class CurrentUserResponse
{
    public UserDto? User { get; set; }
}

// Commands
public record CreateUserRequest(UserDto User) : IRequest<CreateUserResponse>;
public class CreateUserResponse
{
    public UserDto User { get; set; }
}

public record UpdateUserRequest(UserDto User) : IRequest<UpdateUserResponse>;
public class UpdateUserResponse
{
    public UserDto User { get; set; }
}

public record RemoveUserRequest(Guid UserId) : IRequest<RemoveUserResponse>;
public class RemoveUserResponse
{
    public UserDto User { get; set; }
}

public record AuthenticateRequest(string Username, string Password) : IRequest<AuthenticateResponse>;
public record AuthenticateResponse(string AccessToken, Guid UserId);

// Handlers
public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, GetUserByIdResponse>
{
    private readonly IZoomLoopContext _context;
    public GetUserByIdHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUserByIdResponse> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);

        return new GetUserByIdResponse { User = user?.ToDto() };
    }
}

public class GetUsersHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly IZoomLoopContext _context;
    public GetUsersHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Include(x => x.Roles)
            .Where(x => !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return new GetUsersResponse { Users = users.Select(x => x.ToDto()).ToList() };
    }
}

public class UsernameExistsHandler : IRequestHandler<UsernameExistsRequest, UsernameExistsResponse>
{
    private readonly IZoomLoopContext _context;
    public UsernameExistsHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UsernameExistsResponse> Handle(UsernameExistsRequest request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users.AnyAsync(x => x.Username == request.Username, cancellationToken);
        return new UsernameExistsResponse { Exists = exists };
    }
}

public class GetUsersPageHandler : IRequestHandler<GetUsersPageRequest, GetUsersPageResponse>
{
    private readonly IZoomLoopContext _context;
    public GetUsersPageHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUsersPageResponse> Handle(GetUsersPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Users
            .Include(x => x.Roles)
            .Where(x => !x.IsDeleted);

        var length = await query.CountAsync(cancellationToken);
        var users = await query
            .OrderBy(x => x.Username)
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetUsersPageResponse
        {
            Length = length,
            Entities = users.Select(x => x.ToDto()).ToList()
        };
    }
}

public class CurrentUserHandler : IRequestHandler<CurrentUserRequest, CurrentUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentUserHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CurrentUserResponse> Handle(CurrentUserRequest request, CancellationToken cancellationToken)
    {
        var principal = _httpContextAccessor.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return new CurrentUserResponse();
        }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return new CurrentUserResponse();
        }

        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        return new CurrentUserResponse { User = user?.ToDto() };
    }
}

public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    public CreateUserHandler(IZoomLoopContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hashedPassword = _passwordHasher.HashPassword(salt, request.User.Password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.User.Username,
            Salt = salt,
            Password = hashedPassword,
            CurrentProfileId = request.User.CurrentProfileId ?? Guid.Empty,
            DefaultProfileId = request.User.DefaultProfileId ?? Guid.Empty,
            IsDeleted = false
        };

        if (request.User.Roles?.Any() == true)
        {
            var roleIds = request.User.Roles
                .Where(x => x.RoleId.HasValue)
                .Select(x => x.RoleId!.Value)
                .ToList();

            var roles = await _context.Roles
                .Where(x => roleIds.Contains(x.RoleId))
                .ToListAsync(cancellationToken);

            foreach (var role in roles)
            {
                user.Roles.Add(role);
            }
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateUserResponse { User = user.ToDto() };
    }
}

public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    public UpdateUserHandler(IZoomLoopContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .SingleAsync(x => x.UserId == request.User.UserId, cancellationToken);

        user.Username = request.User.Username;

        if (!string.IsNullOrWhiteSpace(request.User.Password))
        {
            user.Password = _passwordHasher.HashPassword(user.Salt, request.User.Password);
        }

        // Update roles if supplied
        if (request.User.Roles?.Any() == true)
        {
            var roleIds = request.User.Roles
                .Where(x => x.RoleId.HasValue)
                .Select(x => x.RoleId!.Value)
                .ToList();

            var roles = await _context.Roles
                .Where(x => roleIds.Contains(x.RoleId))
                .ToListAsync(cancellationToken);

            user.Roles = roles;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateUserResponse { User = user.ToDto() };
    }
}

public class RemoveUserHandler : IRequestHandler<RemoveUserRequest, RemoveUserResponse>
{
    private readonly IZoomLoopContext _context;
    public RemoveUserHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<RemoveUserResponse> Handle(RemoveUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleAsync(x => x.UserId == request.UserId, cancellationToken);
        user.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveUserResponse { User = user.ToDto() };
    }
}

public class AuthenticateHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse?>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenBuilder _tokenBuilder;
    public AuthenticateHandler(IZoomLoopContext context, IPasswordHasher passwordHasher, ITokenBuilder tokenBuilder)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenBuilder = tokenBuilder;
    }

    public async Task<AuthenticateResponse?> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.Username == request.Username && !x.IsDeleted, cancellationToken);

        if (user == null)
        {
            return null;
        }

        var transformedPassword = _passwordHasher.HashPassword(user.Salt, request.Password);
        if (user.Password != transformedPassword)
        {
            return null;
        }

        // basic claims
        _tokenBuilder.AddUsername(user.Username);
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));

        var accessToken = _tokenBuilder.Build();

        return new AuthenticateResponse(accessToken, user.UserId);
    }
}
