// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using ZoomLoop.Core.Models;

namespace ZoomLoop.Core.Services;

public interface ICurrentUserService
{
    Task<User?> GetAsync(CancellationToken cancellationToken = default);
}
