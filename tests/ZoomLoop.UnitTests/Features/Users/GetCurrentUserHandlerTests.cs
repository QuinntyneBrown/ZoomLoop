// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using ZoomLoop.Api.Features.Users.Profile;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services;

namespace ZoomLoop.UnitTests.Features.Users;

[TestFixture]
public class GetCurrentUserHandlerTests
{
    private InMemoryZoomLoopContext _context = default!;
    private Mock<ICurrentUserService> _currentUserService = default!;
    private Mock<ILogger<GetCurrentUserHandler>> _logger = default!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<InMemoryZoomLoopContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new InMemoryZoomLoopContext(options);
        _currentUserService = new Mock<ICurrentUserService>();
        _logger = new Mock<ILogger<GetCurrentUserHandler>>();
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task ShouldReturnUserWithRoles()
    {
        // Arrange
        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            Users = new List<User>(),
            Privileges = new List<Privilege>()
        };

        var userRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "User",
            Users = new List<User>(),
            Privileges = new List<Privilege>()
        };

        _context.Roles.AddRange(adminRole, userRole);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "admin@example.com",
            FirstName = "Admin",
            LastName = "User",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role> { adminRole, userRole },
            Sessions = new List<Session>(),
            PasswordHash = "hash"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Retrieve the tracked entity from the context
        var trackedUser = await _context.Users.FirstAsync(u => u.UserId == userId);
        _currentUserService.Setup(x => x.GetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(trackedUser);

        var handler = new GetCurrentUserHandler(_context, _currentUserService.Object, _logger.Object);
        var request = new GetCurrentUserRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.UserId, Is.EqualTo(userId));
        Assert.That(result.Roles, Is.Not.Null);
        Assert.That(result.Roles.Count, Is.EqualTo(2));
        Assert.That(result.Roles.Any(r => r.Name == "Admin"), Is.True);
        Assert.That(result.Roles.Any(r => r.Name == "User"), Is.True);
    }

    [Test]
    public async Task ShouldReturnEmptyRolesWhenUserHasNoRoles()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "noroles@example.com",
            FirstName = "No",
            LastName = "Roles",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
            PasswordHash = "hash"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Retrieve the tracked entity from the context
        var trackedUser = await _context.Users.FirstAsync(u => u.UserId == userId);
        _currentUserService.Setup(x => x.GetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(trackedUser);

        var handler = new GetCurrentUserHandler(_context, _currentUserService.Object, _logger.Object);
        var request = new GetCurrentUserRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.UserId, Is.EqualTo(userId));
        Assert.That(result.Roles, Is.Not.Null);
        Assert.That(result.Roles.Count, Is.EqualTo(0));
    }

    [Test]
    public async Task ShouldReturnNullWhenUserNotFound()
    {
        // Arrange
        _currentUserService.Setup(x => x.GetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var handler = new GetCurrentUserHandler(_context, _currentUserService.Object, _logger.Object);
        var request = new GetCurrentUserRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldReturnNullWhenNoUserIdClaim()
    {
        // Arrange - CurrentUserService returns null when no claim is present
        _currentUserService.Setup(x => x.GetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var handler = new GetCurrentUserHandler(_context, _currentUserService.Object, _logger.Object);
        var request = new GetCurrentUserRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldReturnUserWithSingleRole()
    {
        // Arrange
        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            Users = new List<User>(),
            Privileges = new List<Privilege>()
        };

        _context.Roles.Add(adminRole);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "singleadmin@example.com",
            FirstName = "Single",
            LastName = "Admin",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role> { adminRole },
            Sessions = new List<Session>(),
            PasswordHash = "hash"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Retrieve the tracked entity from the context
        var trackedUser = await _context.Users.FirstAsync(u => u.UserId == userId);
        _currentUserService.Setup(x => x.GetAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(trackedUser);

        var handler = new GetCurrentUserHandler(_context, _currentUserService.Object, _logger.Object);
        var request = new GetCurrentUserRequest();

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Roles, Is.Not.Null);
        Assert.That(result.Roles.Count, Is.EqualTo(1));
        Assert.That(result.Roles[0].Name, Is.EqualTo("Admin"));
        Assert.That(result.Roles[0].RoleId, Is.EqualTo(adminRole.RoleId));
    }
}
