import jsreport from 'jsreport'; 
import productoService from './productoService.js'; 
import dotenv from 'dotenv';

dotenv.config();

class ReporteService { 
  constructor() { 
    this.jsreport = jsreport({
      // Desactivamos el servidor web propio de jsreport para que no choque con Express
      extensions: {
        express: { enabled: false },
        studio: { enabled: false }
      }
    }); 
  } 

  async init() { 
    await this.jsreport.init(); 
  } 

  async generarReporteOperacional(categoria) { 
    const { productos } = await productoService.getAll({ 
      categoria, 
      limit: 1000 
    }); 
    
    // Pre-procesamos los datos para que Handlebars no necesite helpers complejos
    const productosProcesados = productos.map(p => ({
      ...p.toJSON ? p.toJSON() : p,
      precio_compra_fmt: parseFloat(p.precio_compra).toFixed(2),
      precio_venta_fmt: parseFloat(p.precio_venta).toFixed(2),
      valor_total_fmt: (p.stock_actual * parseFloat(p.precio_compra)).toFixed(2),
      es_bajo_stock: p.stock_actual < p.stock_minimo
    }));

    const template = { 
      content: ` 
        <!DOCTYPE html> 
        <html> 
        <head> 
          <meta charset="UTF-8"> 
          <title>Reporte Operacional de Inventario</title> 
          <style> 
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #0f172a; }
            .header { 
              margin-bottom: 22px;
              padding: 20px 24px;
              border-radius: 12px;
              background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
              border: 1px solid #dbeafe;
            }
            .header h1 { margin: 0; color: #1d4ed8; font-size: 28px; }
            .header p { margin: 6px 0 0; color: #475569; font-size: 13px; }

            .summary {
              margin-top: 12px;
              padding: 12px 14px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #3b82f6;
              border-radius: 10px;
              font-size: 12px;
              color: #334155;
            }

            h2 { color: #1e3a8a; margin: 24px 0 10px; font-size: 18px; }
            .section-desc { margin: 0 0 10px; color: #475569; font-size: 12px; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #e2e8f0; }
            thead tr { background-color: #f8fafc; }
            th { padding: 10px; text-align: left; font-size: 11px; color: #334155; border-bottom: 1px solid #cbd5e1; }
            td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #1f2937; }
            tbody tr:nth-child(even) { background-color: #fcfdff; }

            .pill {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
            }
            .pill-low { background: #fee2e2; color: #991b1b; }
            .pill-ok { background: #dcfce7; color: #166534; }

            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px; }
          </style> 
        </head> 
        <body> 
          <div class="header"> 
            <h1>Reporte Operacional de Inventario</h1> 
            <p>Fecha de generación: {{fecha}}</p> 
            <p>Categoría: {{categoria}}</p> 
            <div class="summary">
              Total de productos: <strong>{{totalProductos}}</strong> |
              Valor total inventario: <strong>$ {{valorTotalInventario}}</strong>
            </div>
          </div> 

          <h2>Detalle Operacional de Productos</h2>
          <p class="section-desc">Listado detallado para control diario de inventario y monitoreo de niveles de stock.</p>
          
          <table> 
            <thead> 
              <tr> 
                <th>SKU</th> 
                <th>Nombre</th> 
                <th>Categoría</th> 
                <th>Stock</th> 
                <th>Mínimo</th> 
                <th>P. Compra</th> 
                <th>P. Venta</th> 
                <th>Valor Total</th> 
                <th>Estado</th>
              </tr> 
            </thead> 
            <tbody> 
              {{#each productos}} 
              <tr> 
                <td>{{sku}}</td> 
                <td>{{nombre}}</td> 
                <td>{{categoria}}</td> 
                <td> 
                  <span class="pill {{#if es_bajo_stock}}pill-low{{else}}pill-ok{{/if}}"> 
                    {{stock_actual}} 
                  </span> 
                </td> 
                <td>{{stock_minimo}}</td> 
                <td>$ {{precio_compra_fmt}}</td> 
                <td>$ {{precio_venta_fmt}}</td> 
                <td>$ {{valor_total_fmt}}</td> 
                <td>
                  {{#if es_bajo_stock}}
                    <span class="pill pill-low">Bajo stock</span>
                  {{else}}
                    <span class="pill pill-ok">Saludable</span>
                  {{/if}}
                </td>
              </tr> 
              {{/each}} 
            </tbody> 
          </table> 
          
          <div class="footer"> 
            <p>Sistema de Gestión de Productos - Reporte generado automáticamente</p> 
            <p>Documento de control operacional para inventario y reposición</p> 
          </div> 
        </body> 
        </html> 
      `, 
      engine: 'handlebars', 
      recipe: 'chrome-pdf' 
    }; 
    
    const fecha = new Date().toLocaleString(); 
    const totalProductos = productos.length; 
    const valorTotalInventario = productos.reduce((sum, p) => 
      sum + (p.stock_actual * parseFloat(p.precio_compra)), 0 
    ).toFixed(2); 
    
    const report = await this.jsreport.render({ 
      template, 
      data: { 
        fecha, 
        categoria: categoria || 'Todas', 
        productos: productosProcesados, 
        totalProductos, 
        valorTotalInventario 
      } 
    }); 
    
    return report.content; 
  } 

  async generarReporteGestion() { 
    const stats = await productoService.getDashboardStats(); 
    const { productos } = await productoService.getAll({ limit: 1000 });

    const productosProcesados = productos
      .map((p) => {
        const raw = p.toJSON ? p.toJSON() : p;
        const precioCompra = parseFloat(raw.precio_compra || 0);
        const precioVenta = parseFloat(raw.precio_venta || 0);
        const valorInventario = raw.stock_actual * precioCompra;
        const margenPct = precioCompra > 0 ? ((precioVenta - precioCompra) / precioCompra) * 100 : 0;

        return {
          ...raw,
          precio_compra_fmt: precioCompra.toFixed(2),
          precio_venta_fmt: precioVenta.toFixed(2),
          valor_inventario_fmt: valorInventario.toFixed(2),
          margen_pct_fmt: margenPct.toFixed(1),
          proveedor_fmt: raw.proveedor || 'No definido',
          es_bajo_stock: raw.stock_actual < raw.stock_minimo
        };
      })
      .sort((a, b) => parseFloat(b.valor_inventario_fmt) - parseFloat(a.valor_inventario_fmt));

    const productosTopValor = productosProcesados.slice(0, 60);
    const valorTotalInventarioNum = Number(stats?.kpis?.valorTotalInventario || 0);
    const productoMasValiosoNombre = stats?.kpis?.productoMasValioso?.nombre || 'N/A';
    const productoMasValiosoValor = Number(stats?.kpis?.productoMasValioso?.valor || 0);
    
    const template = { 
      content: ` 
        <!DOCTYPE html> 
        <html> 
        <head> 
          <meta charset="UTF-8"> 
          <title>Reporte de Gestión - Análisis Estratégico</title> 
          <style> 
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #0f172a; }
            .header { 
              margin-bottom: 28px; 
              padding: 20px 24px; 
              border-radius: 12px; 
              background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
              border: 1px solid #dbeafe;
            }
            .header h1 { margin: 0; color: #1d4ed8; font-size: 28px; }
            .header p { margin: 6px 0 0; color: #475569; font-size: 13px; }

            .kpi-grid { width: 100%; border-collapse: separate; border-spacing: 14px; margin: 18px -14px 4px; }
            .kpi-card { 
              width: 25%;
              border: 1px solid #e2e8f0;
              border-top: 4px solid #3b82f6;
              border-radius: 10px;
              padding: 14px 16px;
              background: #ffffff;
              box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
              vertical-align: top;
            }
            .kpi-card.alt { border-top-color: #059669; }
            .kpi-card.warn { border-top-color: #d97706; }
            .kpi-card.focus { border-top-color: #7c3aed; }
            .kpi-label { color: #64748b; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .kpi-value { margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #0f172a; }
            .kpi-sub { margin: 6px 0 0; font-size: 11px; color: #64748b; }

            h2 { color: #1e3a8a; margin: 28px 0 10px; font-size: 18px; }
            .section-desc { margin: 0 0 10px; color: #475569; font-size: 12px; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #e2e8f0; }
            thead tr { background-color: #f8fafc; }
            th { padding: 10px; text-align: left; font-size: 11px; color: #334155; border-bottom: 1px solid #cbd5e1; }
            td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #1f2937; }
            tbody tr:nth-child(even) { background-color: #fcfdff; }

            .pill {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
            }
            .pill-ok { background: #dcfce7; color: #166534; }
            .pill-low { background: #fee2e2; color: #991b1b; }

            .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px; }
          </style> 
        </head> 
        <body> 
          <div class="header"> 
            <h1>Reporte de Gestión - Análisis de Inventario</h1> 
            <p>Fecha de generación: {{fecha}}</p> 
            <p>Reporte estratégico para toma de decisiones</p> 
          </div> 
          
          <h2>Indicadores Clave de Rendimiento (KPIs)</h2> 
          <table class="kpi-grid">
            <tr>
              <td class="kpi-card">
                <p class="kpi-label">Total Productos</p>
                <p class="kpi-value">{{stats.kpis.totalProductos}}</p>
                <p class="kpi-sub">Inventario total registrado</p>
              </td>
              <td class="kpi-card alt">
                <p class="kpi-label">Valor Total Inventario</p>
                <p class="kpi-value">$ {{valorTotalInventarioFmt}}</p>
                <p class="kpi-sub">Valorizado a precio de compra</p>
              </td>
              <td class="kpi-card warn">
                <p class="kpi-label">Productos Bajo Stock</p>
                <p class="kpi-value">{{stats.kpis.productosBajoStock}}</p>
                <p class="kpi-sub">Con riesgo de quiebre de stock</p>
              </td>
              <td class="kpi-card focus">
                <p class="kpi-label">Producto Más Valioso</p>
                <p class="kpi-value" style="font-size: 14px; line-height: 1.35;">{{productoMasValiosoNombre}}</p>
                <p class="kpi-sub">$ {{productoMasValiosoValorFmt}}</p>
              </td>
            </tr>
          </table>

          <h2>Distribución por Categoría</h2>
          <p class="section-desc">Resumen de volumen de productos por categoría.</p>
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cantidad de Productos</th>
              </tr>
            </thead>
            <tbody>
              {{#each stats.charts.topCategorias}}
              <tr>
                <td>{{this.categoria}}</td>
                <td>{{this.cantidad}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>

          <h2>Detalle de Productos (Top por Valor de Inventario)</h2>
          <p class="section-desc">Listado ampliado para revisión ejecutiva. Se muestran hasta 60 productos ordenados por valor de inventario.</p>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Stock</th>
                <th>Min.</th>
                <th>P. Compra</th>
                <th>P. Venta</th>
                <th>Margen</th>
                <th>Valor Inv.</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {{#each productosTopValor}}
              <tr>
                <td>{{sku}}</td>
                <td>{{nombre}}</td>
                <td>{{categoria}}</td>
                <td>{{proveedor_fmt}}</td>
                <td>{{stock_actual}}</td>
                <td>{{stock_minimo}}</td>
                <td>$ {{precio_compra_fmt}}</td>
                <td>$ {{precio_venta_fmt}}</td>
                <td>{{margen_pct_fmt}}%</td>
                <td>$ {{valor_inventario_fmt}}</td>
                <td>
                  {{#if es_bajo_stock}}
                    <span class="pill pill-low">Bajo stock</span>
                  {{else}}
                    <span class="pill pill-ok">Saludable</span>
                  {{/if}}
                </td>
              </tr>
              {{/each}}
            </tbody>
          </table>
          
          <div class="footer"> 
            <p>Sistema de Gestión de Productos - Reporte Estratégico generado automáticamente</p> 
          </div> 
        </body> 
        </html> 
      `, 
      engine: 'handlebars', 
      recipe: 'chrome-pdf' 
    }; 
    
    const fecha = new Date().toLocaleString(); 
    
    const report = await this.jsreport.render({ 
      template, 
      data: { 
        fecha, 
        stats,
        valorTotalInventarioFmt: valorTotalInventarioNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        productoMasValiosoNombre,
        productoMasValiosoValorFmt: productoMasValiosoValor.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        productosTopValor
      } 
    }); 
    
    return report.content; 
  } 
} 

export default new ReporteService(); 
