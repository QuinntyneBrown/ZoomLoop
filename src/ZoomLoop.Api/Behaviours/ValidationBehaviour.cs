// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Behaviours;

public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<ValidationBehaviour<TRequest, TResponse>> logger;

    public ValidationBehaviour(ILogger<ValidationBehaviour<TRequest, TResponse>> logger)
    {
        this.logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        try
        {
            return await next();
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(
                ex,
                "Validation failure in {RequestName}: {ValidationError}",
                requestName,
                ex.Message);

            throw;
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(
                ex,
                "Business rule violation in {RequestName}: {BusinessRuleError}",
                requestName,
                ex.Message);

            throw;
        }
    }
}
