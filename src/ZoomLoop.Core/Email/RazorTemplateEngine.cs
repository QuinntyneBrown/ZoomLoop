// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using RazorEngineCore;

namespace ZoomLoop.Core.Email;

public class RazorTemplateEngine : ITemplateEngine
{
    private readonly IRazorEngine _razorEngine;

    public RazorTemplateEngine()
    {
        _razorEngine = new RazorEngine();
    }

    public async Task<string> RenderAsync<TModel>(string templateContent, TModel model, CancellationToken cancellationToken = default)
    {
        var template = await _razorEngine.CompileAsync(templateContent, cancellationToken: cancellationToken);
        var result = await template.RunAsync(model);
        return result;
    }
}
