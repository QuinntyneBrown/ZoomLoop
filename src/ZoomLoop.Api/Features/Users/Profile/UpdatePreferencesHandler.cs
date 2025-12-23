// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users.Profile;

public class UpdatePreferencesHandler : IRequestHandler<UpdatePreferencesRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UpdatePreferencesHandler> _logger;

    public UpdatePreferencesHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<UpdatePreferencesHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdatePreferencesRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return false;
        }

        var user = await _context.Users
            .Include(u => u.Preferences)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        if (user.Preferences == null)
        {
            user.Preferences = new UserPreferences
            {
                UserPreferencesId = Guid.NewGuid(),
                UserId = userId
            };
            _context.UserPreferences.Add(user.Preferences);
        }

        user.Preferences.Notifications = new NotificationPreferences
        {
            Email = new EmailNotifications
            {
                PurchaseUpdates = request.Notifications.Email.PurchaseUpdates,
                DeliveryNotifications = request.Notifications.Email.DeliveryNotifications,
                PriceAlerts = request.Notifications.Email.PriceAlerts,
                NewInventory = request.Notifications.Email.NewInventory,
                Newsletter = request.Notifications.Email.Newsletter
            },
            Sms = new SmsNotifications
            {
                DeliveryDay = request.Notifications.Sms.DeliveryDay,
                Appointments = request.Notifications.Sms.Appointments,
                Promotions = request.Notifications.Sms.Promotions
            },
            Push = new PushNotifications
            {
                DeliveryTracking = request.Notifications.Push.DeliveryTracking,
                FavoriteUpdates = request.Notifications.Push.FavoriteUpdates
            }
        };

        user.Preferences.Search = new SearchPreferences
        {
            DefaultLocation = request.Search.DefaultLocation,
            DefaultRadius = request.Search.DefaultRadius,
            PreferredMakes = request.Search.PreferredMakes
        };

        user.Preferences.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Preferences updated for user: {UserId}", userId);

        return true;
    }
}
