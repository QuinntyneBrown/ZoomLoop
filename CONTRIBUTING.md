# Contributing

## Guidelines

This repository follows strict, automated-friendly coding standards to keep the codebase consistent and maintainable. All contributors must follow these rules when adding or modifying code.

### One type per file
- Every top-level type (class, record, interface, enum, struct, delegate) should be declared in its own file. Files that contain multiple top-level types should be split so there is exactly one top-level type per file.
- File name MUST match the primary type name exactly (PascalCase). For example, `CreateJsonContentHandler` must be in `CreateJsonContentHandler.cs`.
- Types that are closely related may live in the same folder and namespace but must remain in separate files.

### Namespaces and folders
- The folder structure should mirror the namespace structure used by the project. Do not nest unrelated namespaces in the same folder.

### Partial types
- `partial` types are allowed when the type is intentionally split across files (for code generation or very specific reasons). All partial files must follow the naming convention `TypeName.PartX.cs` where `PartX` is a meaningful suffix.

### Formatting and style
- Follow the rules established in `.editorconfig`. Use the project's standard formatting, naming, and accessibility conventions.
- Avoid file-level multiple types even for small DTOs. DTOs should be in their own files and named accordingly.

### Validation and CI
- Before pushing changes, ensure the solution builds locally and unit tests pass.
- The CI pipeline enforces formatting and style checks; fix any reported issues before creating a pull request.

## How to apply the rule (manual steps)
1. Identify files containing multiple top-level types.
2. For each type, create a new file under the same folder with the exact name of the type, e.g., `JsonContentDto.cs`.
3. Move the type declaration into the new file and keep the original namespace and using directives as needed.
4. Remove the moved type from the original file. If the original file becomes empty, delete it.
5. Build and run tests to ensure no breakage.
6. Commit changes with a descriptive message: `chore: split <OldFile> into single-type files`.

## Example
Given `JsonContents.cs` containing multiple handlers and DTOs, split it into:
- `JsonContentExtensions.cs`
- `JsonContentDto.cs`
- `GetJsonContentByIdRequest.cs`
- `GetJsonContentByIdHandler.cs`
- ...

Each file should retain the same namespace `ZoomLoop.Api.Features.JsonContents` and required `using` directives.

## Contact
If you are unsure about applying these rules to a specific case, open an issue or ask for guidance in the project repository.