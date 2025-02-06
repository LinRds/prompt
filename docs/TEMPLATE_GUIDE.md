# Template Editing Guide

This guide explains how to edit existing templates and add new templates to the AI Programming Template Generation System.

## Template Structure

Templates are organized by development phases:
- Planning Phase Templates
- Implementation Phase Templates
- Maintenance Phase Templates
  - Testing Templates
  - Security Templates
  - Optimization Templates
  - Version Control Templates

Each template consists of:
- Default Prompt: The main template content
- Additional Prompts: Task-specific specialized prompts

## Template Location

Templates are stored in the following structure:
```
src/
└── templates/
    ├── planning/
    ├── implementation/
    └── maintenance/
```

## How to Edit Existing Templates

1. **Locate the Template**
   - Navigate to the appropriate phase directory
   - Find the template file you want to modify
   - Templates are stored in JSON format

2. **Template Format**
   ```json
   {
     "id": "unique_template_id",
     "nodeId": "parent_node_id",
     "title": "Template Title",
     "description": "Brief description of the template's purpose",
     "content": "Main prompt content with [variable_placeholders]"
   }
   ```

3. **Variable Placeholders**
   - Use `[variable_name]` syntax for customizable parts
   - Common variables include:
     - `[project_name]`
     - `[language]`
     - `[framework]`
     - `[feature_description]`
     - `[code]` - For code review/analysis
     - `[bug_description]` - For debugging
     - `[schema]` - For database operations
     - `[version]` - For version control

4. **Best Practices for Editing**
   - Maintain clear and concise language
   - Keep prompts focused on specific tasks
   - Include examples where helpful
   - Test the template after editing

## Adding New Templates

1. **Create Template File**
   - Choose the appropriate phase directory
   - Create a new JSON file with a descriptive name
   - Follow the template format shown above

2. **Required Fields**
   - All templates must include:
     - Unique ID
     - Title
     - Description
     - Core prompt
     - At least one assistant prompt

3. **Template Guidelines**
   - Keep prompts clear and actionable
   - Include relevant context
   - Consider common use cases
   - Add appropriate variable placeholders

4. **Testing New Templates**
   - Verify JSON format
   - Test all variable placeholders
   - Check template rendering
   - Validate assistant prompt integration

## Best Practices

1. **Writing Effective Prompts**
   - Be specific and detailed
   - Use consistent terminology
   - Include context and requirements
   - Consider edge cases

2. **Variable Usage**
   - Use meaningful variable names
   - Document all variables
   - Keep variables consistent across templates
   - Don't overuse variables

3. **Maintenance**
   - Regularly review and update templates
   - Remove obsolete content
   - Keep documentation current
   - Consider user feedback

## Common Issues and Solutions

1. **Template Not Showing**
   - Verify JSON format
   - Check file location
   - Validate template ID

2. **Variable Issues**
   - Ensure correct bracket syntax `[variable]`
   - Check variable naming consistency
   - Verify all variables are documented

3. **Rendering Problems**
   - Validate template format
   - Check for special characters
   - Verify template size

## Contributing Guidelines

1. **Before Adding Templates**
   - Review existing templates
   - Avoid duplicates
   - Ensure template adds value
   - Follow naming conventions

2. **Quality Standards**
   - Clear and professional language
   - Comprehensive documentation
   - Proper formatting
   - Tested functionality

3. **Review Process**
   - Self-review checklist
   - Peer review if possible
   - Testing in development
   - Documentation updates

## Need Help?

If you encounter any issues or need assistance:
- Check the troubleshooting section
- Review the example templates
- Consult the main documentation
- Raise an issue in the project repository 