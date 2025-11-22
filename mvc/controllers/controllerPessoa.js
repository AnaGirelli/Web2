import { Pessoa } from '../models/index.js'; // Ajuste a importação para o padrão do projeto

export default {
    
    // Autenticação para o login
    async authenticate(req, res) {
        try {
            const { email, senha } = req.body; // Captura dados do formulário

            // 1. Busca a Pessoa no banco de dados pelo e-mail
            const pessoa = await Pessoa.findOne({ where: { email } });

            if (!pessoa) {
                return res.render('login', { error: 'E-mail ou senha inválidos' });
            }
            // 2. Verifica se a senha está correta
            if (pessoa.senha !== senha) {
                return res.render('login', { error: 'E-mail ou senha inválidos' });
            }

            // 3. Login SUCESSO: Configura a sessão
            req.session.isAuthenticated = true;
            req.session.userId = pessoa.id_pessoa;
            req.session.userName = pessoa.nome_pessoa;

            // 4. Redireciona para a página principal (Home/Dashboard)
            return res.redirect('/home');
            
        } catch (error) {
            console.error('Erro de autenticação:', error);
            return res.render('login', { error: 'Erro interno do servidor.' });
        }
    },
   /* // GET para o login
    async getLogin(req, res) {
            res.render('',{layout: 'login.html'});
        },
    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },
    */
    // POST /pessoa (Criar novo)
    async postPessoa(req, res) {
        try {
            // Cria um novo registro com os dados do corpo da requisição
            const novaPessoa = await Pessoa.create(req.body);
            // Retorna status 201 Created
            return res.status(201).json(novaPessoa);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar pessoa', details: error.message });
        }
    },

    // PUT /pessoa/:id (Atualizar)
    async putPessoa(req, res) {
        try {
            // 1. Tenta atualizar o registro pelo id_pessoa (chave primária)
            const [updated] = await Pessoa.update(req.body, {
                where: { id_pessoa: req.params.id }
            });

            if (updated === 0) {
                // Se 0 registros foram atualizados, retorna 404 Not Found
                return res.status(404).json({ error: 'Pessoa não encontrada para atualização' });
            }

            // 2. Busca o registro atualizado para retorná-lo ao cliente
            const pessoaAtualizada = await Pessoa.findByPk(req.params.id);
            return res.status(200).json(pessoaAtualizada); // Retorna 200 OK
            
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar pessoa', details: error.message });
        }
    },

    // DELETE /pessoa/:id (Deletar)
    async deletePessoa(req, res) {
        try {
            // Deleta o registro pelo id_pessoa
            const deletado = await Pessoa.destroy({
                where: { id_pessoa: req.params.id }
            });

            if (deletado === 0) {
                // Se 0 registros foram deletados, retorna 404 Not Found
                return res.status(404).json({ error: 'Pessoa não encontrada para exclusão' });
            }

            // Retorna 200 OK com mensagem de sucesso
            return res.status(200).json({ mensagem: 'Pessoa deletada com sucesso' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar pessoa', details: error.message });
        }
    }
};