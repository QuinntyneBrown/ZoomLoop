// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users.Profile;

public class GetPreferencesHandler : IRequestHandler<GetPreferencesRequest, GetPreferencesResponse?>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetPreferencesHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetPreferencesResponse?> Handle(GetPreferencesRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return null;
        }

        var user = await _context.Users
            .Include(u => u.Preferences)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return null;
        }

        var prefs = user.Preferences;

        if (prefs == null)
        {
            return new GetPreferencesResponse(
                new NotificationPreferencesDto(
                    new EmailNotificationsDto(true, true, true, true, false),
                    new SmsNotificationsDto(true, true, false),
                    new PushNotificationsDto(true, true)),
                new SearchPreferencesDto(null, 50, []));
        }

        return new GetPreferencesResponse(
            new NotificationPreferencesDto(
                new EmailNotificationsDto(
                    prefs.Notifications.Email.PurchaseUpdates,
                    prefs.Notifications.Email.DeliveryNotifications,
                    prefs.Notifications.Email.PriceAlerts,
                    prefs.Notifications.Email.NewInventory,
                    prefs.Notifications.Email.Newsletter),
                new SmsNotificationsDto(
                    prefs.Notifications.Sms.DeliveryDay,
                    prefs.Notifications.Sms.Appointments,
                    prefs.Notifications.Sms.Promotions),
                new PushNotificationsDto(
                    prefs.Notifications.Push.DeliveryTracking,
                    prefs.Notifications.Push.FavoriteUpdates)),
            new SearchPreferencesDto(
                prefs.Search.DefaultLocation,
                prefs.Search.DefaultRadius,
                prefs.Search.PreferredMakes));
    }
}
