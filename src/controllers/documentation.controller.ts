import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiExcludeController()
@Controller('api-documentation')
export class DocumentationController {
  @Get()
  getApiDocumentation(@Res() res: Response) {
    try {
      const docPath = path.resolve(process.cwd(), 'API_DOCUMENTATION.md');
      
      if (fs.existsSync(docPath)) {
        const content = fs.readFileSync(docPath, 'utf8');
        
        // Send HTML that renders markdown using marked library
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Volunteer Bazaar API Documentation</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            pre {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
            }
            code {
              font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
              background-color: rgba(0, 0, 0, 0.05);
              padding: 3px 5px;
              border-radius: 3px;
            }
            pre code {
              background-color: transparent;
              padding: 0;
            }
            h1, h2, h3, h4 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 {
              font-size: 2em;
              padding-bottom: 0.3em;
              border-bottom: 1px solid #eaecef;
            }
            h2 {
              font-size: 1.5em;
              padding-bottom: 0.3em;
              border-bottom: 1px solid #eaecef;
            }
            h3 {
              font-size: 1.25em;
            }
            h4 {
              font-size: 1em;
            }
            .navbar {
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eaecef;
              text-align: center;
              color: #666;
            }
          </style>
        </head>
        <body>
          <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">Volunteer Bazaar API</a>
              <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link" href="/api-docs">Swagger UI</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" href="/api-documentation">Documentation</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        
          <div id="content"></div>
          
          <div class="footer">
            <p>Volunteer Bazaar API Documentation &copy; ${new Date().getFullYear()}</p>
          </div>
          
          <script>
            document.getElementById('content').innerHTML = marked.parse(\`${content.replace(/`/g, '\\`')}\`);
          </script>
        </body>
        </html>
        `;
        
        res.header('Content-Type', 'text/html');
        return res.send(html);
      } else {
        return res.status(404).send('API documentation file not found');
      }
    } catch (error) {
      console.error('Error serving API documentation:', error);
      return res.status(500).send('Error serving API documentation');
    }
  }
  
  @Get('raw')
  getRawApiDocumentation(@Res() res: Response) {
    try {
      const docPath = path.resolve(process.cwd(), 'API_DOCUMENTATION.md');
      
      if (fs.existsSync(docPath)) {
        const content = fs.readFileSync(docPath, 'utf8');
        res.header('Content-Type', 'text/markdown');
        return res.send(content);
      } else {
        return res.status(404).send('API documentation file not found');
      }
    } catch (error) {
      console.error('Error serving API documentation:', error);
      return res.status(500).send('Error serving API documentation');
    }
  }
} 