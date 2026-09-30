const Usuario = require('../models/Usuario');

class ColeiraService {
  async listarPorUsuario(usuarioId) {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.status = 404;
      throw erro;
    }
    return usuario.coleiras;
  }

  async buscarAlertas(usuarioId) {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.status = 404;
      throw erro;
    }

    return usuario.coleiras
      .filter((col) => {
        const historico = col.bubalino?.historico_estresse;
        if (!historico || historico.length === 0) return false;
        const ultimoStatus = historico[historico.length - 1];
        return ultimoStatus.estado_estresse !== 'Ocioso';
      })
      .map((col) => ({
        n_coleira: col.n_coleira,
        n_etiqueta: col.bubalino.n_etiqueta,
        raca: col.bubalino.raca,
        sexo: col.bubalino.sexo,
        pasto: col.coleira_localizacao,
        estresse_atual: col.bubalino.historico_estresse.slice(-1)[0],
        ultima_biometria: col.bubalino.dados.slice(-1)[0],
        ultima_posicao: col.bubalino.localizacao.slice(-1)[0]
      }));
  }
}

module.exports = new ColeiraService();