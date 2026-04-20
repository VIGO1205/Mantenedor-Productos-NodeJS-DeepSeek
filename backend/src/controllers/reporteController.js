import reporteService from '../services/reporteService.js';

export const getReporteOperacional = async (req, res) => { 
  try { 
    console.log('Request received for getReporteOperacional');
    const { categoria } = req.query;
    const pdf = await reporteService.generarReporteOperacional(categoria);
    
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReporteGestion = async (req, res) => {
  try {
    const pdf = await reporteService.generarReporteGestion();
    
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
