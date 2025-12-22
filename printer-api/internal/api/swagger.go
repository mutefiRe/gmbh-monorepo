package api

import (
	"fmt"
	"net/http"
	"os"
)

const openAPISpecPath = "api/spec/openapi.yaml"

func serveOpenAPI(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile(openAPISpecPath)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "spec_not_found", err.Error())
		return
	}
	w.Header().Set("Content-Type", "application/yaml")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(data)
}

func writeSwaggerUI(w http.ResponseWriter, specURL string) {
	html := fmt.Sprintf(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Printer API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: %q,
        dom_id: '#swagger-ui'
      });
    </script>
  </body>
</html>`, specURL)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write([]byte(html))
}
