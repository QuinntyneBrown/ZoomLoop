// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using NUnit.Framework;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services;

namespace ZoomLoop.UnitTests.Services;

[TestFixture]
public class CurrentUserServiceTests
{
    private IHttpContextAccessor _httpContextAccessor = null!;
    private IZoomLoopContext _context = null!;
    private CurrentUserService _service = null!;
    private DbSet<User> _usersDbSet = null!;

    [SetUp]
    public void SetUp()
    {
        _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        _context = Substitute.For<IZoomLoopContext>();
    }

    #region GetAsync - Successful Retrieval

    [Test]
    public async Task GetAsync_WhenUserExists_ReturnsUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var userEmail = "test@example.com";
        var expectedUser = new User
        {
            UserId = userId,
            Email = userEmail,
            FirstName = "Test",
            LastName = "User"
        };

        var users = new List<User> { expectedUser };
        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Email, Is.EqualTo(userEmail));
        Assert.That(result.UserId, Is.EqualTo(expectedUser.UserId));
    }

    [Test]
    public async Task GetAsync_WhenMultipleUsersExist_ReturnsCorrectUser()
    {
        // Arrange
        var targetUserId = Guid.NewGuid();
        var targetEmail = "target@example.com";
        var users = new List<User>
        {
            new User { UserId = Guid.NewGuid(), Email = "other1@example.com", FirstName = "Other1", LastName = "User" },
            new User { UserId = targetUserId, Email = targetEmail, FirstName = "Target", LastName = "User" },
            new User { UserId = Guid.NewGuid(), Email = "other2@example.com", FirstName = "Other2", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, targetUserId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Email, Is.EqualTo(targetEmail));
        Assert.That(result.FirstName, Is.EqualTo("Target"));
    }

    #endregion

    #region GetAsync - Null/Empty Claim

    [Test]
    public async Task GetAsync_WhenClaimIsNull_ReturnsNull()
    {
        // Arrange
        var httpContext = new DefaultHttpContext();
        _httpContextAccessor.HttpContext.Returns(httpContext);

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAsync_WhenHttpContextIsNull_ReturnsNull()
    {
        // Arrange
        _httpContextAccessor.HttpContext.Returns((HttpContext?)null);

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAsync_WhenClaimValueIsEmpty_ReturnsNull()
    {
        // Arrange
        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, string.Empty);

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Null);
    }

    #endregion

    #region GetAsync - User Not Found

    [Test]
    public async Task GetAsync_WhenUserNotFound_ReturnsNull()
    {
        // Arrange
        var nonExistentUserId = Guid.NewGuid();
        var users = new List<User>
        {
            new User { UserId = Guid.NewGuid(), Email = "other@example.com", FirstName = "Other", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, nonExistentUserId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAsync_WhenNoUsersInDatabase_ReturnsNull()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var users = new List<User>();

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Null);
    }

    #endregion

    #region GetAsync - UserId Matching Behavior

    [Test]
    public async Task GetAsync_MatchesByUserId()
    {
        // Arrange: The claim contains a UserId GUID
        var userEmail = "user@example.com";
        var userId = Guid.NewGuid();
        var users = new List<User>
        {
            new User { UserId = userId, Email = userEmail, FirstName = "Test", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        // Claim value is the UserId GUID
        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.UserId, Is.EqualTo(userId));
        Assert.That(result.Email, Is.EqualTo(userEmail));
    }

    [Test]
    public async Task GetAsync_WhenClaimContainsInvalidGuid_ReturnsNull()
    {
        // Arrange: If the claim contains a non-GUID string, it should return null
        var userId = Guid.NewGuid();
        var users = new List<User>
        {
            new User { UserId = userId, Email = "user@example.com", FirstName = "Test", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        // Claim value is not a valid GUID
        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, "not-a-valid-guid");

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert: Should be null because the claim is not a valid GUID
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAsync_WhenClaimContainsEmailInsteadOfGuid_ReturnsNull()
    {
        // Arrange: If someone passes an email as the claim, it should fail to parse as GUID
        var userId = Guid.NewGuid();
        var userEmail = "user@example.com";
        var users = new List<User>
        {
            new User { UserId = userId, Email = userEmail, FirstName = "Test", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        // Claim value is an email (not a GUID)
        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userEmail);

        _service = new CurrentUserService(_httpContextAccessor, _context);

        // Act
        var result = await _service.GetAsync();

        // Assert: Should be null because email is not a valid GUID
        Assert.That(result, Is.Null);
    }

    #endregion

    #region GetAsync - Cancellation Token

    [Test]
    public async Task GetAsync_PassesCancellationToken()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var userEmail = "test@example.com";
        var expectedUser = new User
        {
            UserId = userId,
            Email = userEmail,
            FirstName = "Test",
            LastName = "User"
        };

        var users = new List<User> { expectedUser };
        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        using var cts = new CancellationTokenSource();

        // Act
        var result = await _service.GetAsync(cts.Token);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Email, Is.EqualTo(userEmail));
    }

    [Test]
    public void GetAsync_WhenCancellationRequested_ThrowsOperationCanceledException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var userEmail = "test@example.com";
        var users = new List<User>
        {
            new User { UserId = userId, Email = userEmail, FirstName = "Test", LastName = "User" }
        };

        var usersDbSet = CreateMockDbSet(users);
        _context.Users.Returns(usersDbSet);

        SetupHttpContextWithClaim(ClaimTypes.NameIdentifier, userId.ToString());

        _service = new CurrentUserService(_httpContextAccessor, _context);

        using var cts = new CancellationTokenSource();
        cts.Cancel();

        // Act & Assert
        Assert.ThrowsAsync<OperationCanceledException>(async () =>
            await _service.GetAsync(cts.Token));
    }

    #endregion

    #region Helper Methods

    private void SetupHttpContextWithClaim(string claimType, string claimValue)
    {
        var claims = new List<Claim> { new Claim(claimType, claimValue) };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        _httpContextAccessor.HttpContext.Returns(httpContext);
    }

    private static DbSet<T> CreateMockDbSet<T>(List<T> data) where T : class
    {
        var queryable = data.AsQueryable();
        var dbSet = Substitute.For<DbSet<T>, IQueryable<T>, IAsyncEnumerable<T>>();

        ((IQueryable<T>)dbSet).Provider.Returns(new TestAsyncQueryProvider<T>(queryable.Provider));
        ((IQueryable<T>)dbSet).Expression.Returns(queryable.Expression);
        ((IQueryable<T>)dbSet).ElementType.Returns(queryable.ElementType);
        ((IQueryable<T>)dbSet).GetEnumerator().Returns(queryable.GetEnumerator());

        ((IAsyncEnumerable<T>)dbSet).GetAsyncEnumerator(Arg.Any<CancellationToken>())
            .Returns(new TestAsyncEnumerator<T>(data.GetEnumerator()));

        return dbSet;
    }

    #endregion
}

#region Async Test Helpers

internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
{
    private readonly IQueryProvider _inner;

    public TestAsyncQueryProvider(IQueryProvider inner)
    {
        _inner = inner;
    }

    public IQueryable CreateQuery(System.Linq.Expressions.Expression expression)
    {
        return new TestAsyncEnumerable<TEntity>(expression);
    }

    public IQueryable<TElement> CreateQuery<TElement>(System.Linq.Expressions.Expression expression)
    {
        return new TestAsyncEnumerable<TElement>(expression);
    }

    public object? Execute(System.Linq.Expressions.Expression expression)
    {
        return _inner.Execute(expression);
    }

    public TResult Execute<TResult>(System.Linq.Expressions.Expression expression)
    {
        return _inner.Execute<TResult>(expression);
    }

    public TResult ExecuteAsync<TResult>(System.Linq.Expressions.Expression expression, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var resultType = typeof(TResult).GetGenericArguments()[0];
        var executeMethod = typeof(IQueryProvider)
            .GetMethods()
            .First(m => m.Name == nameof(IQueryProvider.Execute) && m.IsGenericMethod)
            .MakeGenericMethod(resultType);

        var result = executeMethod.Invoke(_inner, new object[] { expression });
        return (TResult)typeof(Task).GetMethod(nameof(Task.FromResult))!
            .MakeGenericMethod(resultType)
            .Invoke(null, new[] { result })!;
    }
}

internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
{
    public TestAsyncEnumerable(IEnumerable<T> enumerable) : base(enumerable) { }

    public TestAsyncEnumerable(System.Linq.Expressions.Expression expression) : base(expression) { }

    public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
    {
        return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
    }

    IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
}

internal class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _inner;

    public TestAsyncEnumerator(IEnumerator<T> inner)
    {
        _inner = inner;
    }

    public T Current => _inner.Current;

    public ValueTask DisposeAsync()
    {
        _inner.Dispose();
        return ValueTask.CompletedTask;
    }

    public ValueTask<bool> MoveNextAsync()
    {
        return ValueTask.FromResult(_inner.MoveNext());
    }
}

#endregion
