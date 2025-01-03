import { getConnection, sql } from "../database/connection.js";

export const getBens = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("inventario", req.params.inventario).query("SELECT IV.cdItem, IV.nrPlaca,\
              I.dsReduzida, IV.cdLocalizacaoReal,\
              L.dsLocalizacao, IV.cdEstadoConserReal, E.dsEstadoConser, IV.cdSituacaoAtual, S.dsSituacao, FORMAT(IV.vlAtual, 'C', 'pt-BR') AS vlAtual, \
              CASE WHEN IV.cdAlteracao IS NULL THEN '' ELSE 'BEM JÁ INVENTARIADO!' END AS StatusBem, IV.dsObservacao \
              FROM   dbo.INVENTARIOITEM AS IV INNER JOIN \
              dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido WHERE IV.cdinventario = @inventario AND IV.Bloqueado = 'N'");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// busca bens para enviar para o dispositivo
export const getBensSqlite = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("inventario", req.params.inventario).query("SELECT IV.cdItem, IV.nrPlaca,\
              I.dsReduzida, IV.cdLocalizacaoReal,\
              L.dsLocalizacao, IV.cdEstadoConserReal, E.dsEstadoConser, IV.cdSituacaoAtual, S.dsSituacao, FORMAT(IV.vlAtual, 'C', 'pt-BR') AS vlAtual, \
              IV.cdInventario, IV.cdAlteracao, IVE.Estado AS stInventario, IV.dsObservacao  \
              FROM   dbo.INVENTARIOITEM AS IV INNER JOIN \
              dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido INNER JOIN \
              dbo.INVENTARIO AS IVE ON IV.cdInventario = IVE.cdInventario \
              WHERE IV.cdinventario = @inventario AND IV.Bloqueado = 'N'");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const getInventario = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("inventario", req.params.inventario).query("SELECT Estado AS stInventario FROM \
       dbo.INVENTARIO WHERE cdinventario = @inventario");
     return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


/* export const createNewBens = async (req, res) => {
  const { name, description, quantity = 0, price } = req.body;

  if (description == null || name == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("description", sql.Text, description)
      .input("quantity", sql.Int, quantity)
      .input("price", sql.Decimal, price)
      .query(
        "INSERT INTO products (name, description, quantity, price) VALUES (@name,@description,@quantity,@price); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      name,
      description,
      quantity,
      price,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}; */

export const getBensById = async (req, res) => {
  try {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("placa", req.params.id)
      .input("inventario", req.params.inventario)
      .query("SELECT IV.cdItem, IV.nrPlaca, CAST(I.dsReduzida AS char(60)) as dsReduzida, IV.cdLocalizacaoReal,\
              L.dsLocalizacao, IV.cdEstadoConserReal, E.dsEstadoConser, IV.cdSituacaoAtual,\
              S.dsSituacao, FORMAT(IV.vlAtual, 'C', 'pt-BR') AS vlAtual, IV.cdinventario, CASE WHEN IV.cdAlteracao IS NULL\
              THEN '' ELSE 'BEM JÁ INVENTARIADO!' END AS StatusBem, IV.dsObservacao  \
              FROM   dbo.INVENTARIOITEM AS IV INNER JOIN \
              dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido WHERE (IV.nrplaca = @placa \
              or IV.cdItem = @placa) and IV.cdinventario = @inventario AND IV.Bloqueado = 'N'"
            );

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

/* export const deleteBenstById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM products WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}; */

export const getTotalBens = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request()
		.input("inventario", req.params.inventario)
		.query("SELECT COUNT(*) AS Total FROM dbo.INVENTARIOITEM AS IV INNER JOIN \
              	dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              	dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              	dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              	dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido WHERE IV.cdinventario = @inventario AND IV.Bloqueado = 'N'");
  res.json({ totalBens: result.recordset[0].Total });
};


export const getTotalInventariados = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request()
		.input("inventario", req.params.inventario)
		.query("SELECT\
	        (SELECT COUNT(*) AS Total FROM dbo.INVENTARIOITEM AS IV INNER JOIN \
              	dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              	dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              	dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              	dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido WHERE IV.cdinventario = @inventario AND IV.Bloqueado = 'N') - \
	        (SELECT COUNT(*) AS NaoInventariados FROM dbo.INVENTARIOITEM AS IV INNER JOIN \
              	dbo.ITEM AS I ON IV.cdItem = I.cdItem INNER JOIN \
              	dbo.LOCALIZACAO AS L ON IV.cdLocalizacaoReal = L.cdLocalReduzido INNER JOIN \
              	dbo.ESTADOCONSERVACAO AS E ON IV.cdEstadoConserReal = E.cdEstadoConser INNER JOIN \
              	dbo.SITUACAO AS S ON IV.cdSituacaoAtual = S.cdSituacaoReduzido WHERE IV.cdinventario = @inventario and\
				        IV.cdAlteracao IS NULL AND IV.Bloqueado = 'N') AS Inventariados");
  res.json({ totalInventariados: result.recordset[0].Inventariados });
};


// Atualiza os itens após sua gravação no coletor
export const updateBensById = async (req, res) => {
  const { cdLocalizacaoReal, cdEstadoConserReal, cdSituacaoAtual, dsObservacao } = req.body;
  const { id, inven } = req.params;

  // Verifica se os campos necessários foram enviados
  if (
    cdLocalizacaoReal == null ||
    cdEstadoConserReal == null ||
    cdSituacaoAtual == null 
  ) {
    return res.status(400).json({ msg: "Falha na requisição. Por favor informe os campos!" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("placa", sql.VarChar, id) // Define o tipo correto para o parâmetro placa (se for string)
      .input("inven", sql.Int, inven)
      .input("cdLocalizacaoReal", sql.Int, cdLocalizacaoReal)
      .input("cdEstadoConserReal", sql.Int, cdEstadoConserReal)
      .input("cdSituacaoAtual", sql.Int, cdSituacaoAtual)
      .input("dsObservacao", sql.VarChar, dsObservacao)
      .query(
        "UPDATE INVENTARIOITEM SET cdLocalizacaoReal = @cdLocalizacaoReal, cdEstadoConserReal = @cdEstadoConserReal,\
        cdSituacaoAtual = @cdSituacaoAtual, dsObservacao = @dsObservacao, cdMotivo = CASE WHEN @dsObservacao != '' \
        THEN 1 ELSE '' END, cdAlteracao = CASE WHEN @dsObservacao = '' THEN 3 ELSE 2 END WHERE nrPlaca = @placa or cdItem = @placa and cdInventario = @inven" 
      );

    // Verifica se alguma linha foi afetada pela atualização
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    // Responde com os dados atualizados
    res.json({ 
      cdLocalizacaoReal, 
      cdEstadoConserReal, 
      cdSituacaoAtual, 
      id 
    });
  } catch (error) {
    console.error("Erro ao atualizar os dados:", error); // Log do erro para depuração
    res.status(500).send(error.message); // Retorna a mensagem de erro
  }
};

// Atualiza a tabela INVENTARIOITEM no servidor a partir da base do dispositivo
export const updateBase = async (req, res) => {
  const { itens } = req.body; // Espera um array de itens
  const { inven } = req.params;

  // Verifica se os itens foram enviados e se é um array
  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ msg: "Falha na requisição. Por favor informe os itens!" });
  }

  try {
    const pool = await getConnection();

      for (const item of itens) { // Use forEach ou um loop for...of
        const { cdItem, cdLocalizacaoReal, cdEstadoConserReal, cdSituacaoAtual, dsObservacao, cdAlteracao } = item;

        // Executa a consulta de atualização para cada item
        const result = await pool
          .request()
          .input("inven", sql.Int, inven)
          .input("cdItem", sql.Int, cdItem)
          .input("cdLocalizacaoReal", sql.Int, cdLocalizacaoReal)
          .input("cdEstadoConserReal", sql.Int, cdEstadoConserReal)
          .input("cdSituacaoAtual", sql.Int, cdSituacaoAtual)
          .input("dsObservacao", sql.VarChar, dsObservacao)
	        .input("cdAlteracao", sql.Int, cdAlteracao)
          .query(
            "UPDATE INVENTARIOITEM SET cdLocalizacaoReal = @cdLocalizacaoReal, cdEstadoConserReal = @cdEstadoConserReal,\
            cdSituacaoAtual = @cdSituacaoAtual, cdMotivo = CASE WHEN @dsObservacao != '' THEN 1 ELSE '' END, \
            dsObservacao = @dsObservacao, cdAlteracao = @cdAlteracao WHERE cdInventario = @inven AND cdItem = @cdItem"
          );

        // Verifica se alguma linha foi afetada pela atualização
        if (result.rowsAffected[0] === 0) {
          console.warn(`Nenhum item encontrado para atualizar com cdItem: ${cdItem}`);
        }
      }

    
    return res.status(200).json({ msg: "Atualização concluída com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar os dados:", error);
    return res.status(500).send(error.message); // Retorna a mensagem de erro
  }
};


export const getLocais = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("ug", req.params.ug).query("SELECT cdLocalReduzido, dsLocalizacao from LOCALIZACAO \
                                            WHERE inNatureza = 'A' AND inInativa = 0 AND cdUnidadeGestora = @ug \
                                             ORDER BY dsLocalizacao");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// Busca na base do servidor todas as localizaçoes ativas
export const getLocaisGeral = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input("ug", req.params.ug).query("SELECT cdLocalReduzido, dsLocalizacao from LOCALIZACAO \
                                            WHERE inNatureza = 'A' AND inInativa = 0 \
                                             ORDER BY dsLocalizacao");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getSituacao = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT cdSituacaoReduzido, dsSituacao FROM SITUACAO WHERE inNatureza = 'A'");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getEstado = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT cdEstadoConser, dsEstadoConser FROM ESTADOCONSERVACAO");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getCdinventario = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT cdInventario FROM INVENTARIO");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// Busca todos inventários Ativos
export const getInventariosAtivos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT cdInventario, dsInventario, FORMAT(dtInicio, 'dd/MM/yyyy') AS dtInicio, cdComissao FROM INVENTARIO WHERE ESTADO IN (0, 2)");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// Passa a variável para a aplicação
export const getDispositivo = async (req, res) => {
  try {
    // Captura o valor de ID_DISPOSITIVO do arquivo .env
    const dispositivoEnv = process.env.ID_DISPOSITIVO; // Aqui você pega o valor da variável de ambiente

    // Adiciona o valor do .env ao resultado
    res.json(dispositivoEnv);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
