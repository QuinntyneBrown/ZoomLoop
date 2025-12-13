// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Email;

public interface ITemplateEngine
{
    Task<string> RenderAsync<TModel>(string templateContent, TModel model, CancellationToken cancellationToken = default);
}
