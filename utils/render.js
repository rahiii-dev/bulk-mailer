import handlebars from "handlebars";

/**
 * Renders a Handlebars template with data from a JSON file
 */
export function renderTemplateWithData(template, data) {
  const compiledTemplate = handlebars.compile(template);
  const renderedHtml = compiledTemplate(data);
  return renderedHtml;
}
