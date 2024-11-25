import  {getTodosPosts , criarPost , atualizarPost}  from "../models/postsModel.js"
import fs from 'fs'
import gerarDescricaoComGemini from "../services/geminiService.js"

async function listarPosts(req , res) {
    const posts = await getTodosPosts()
    res.status(200).json(posts)
}

async function postarNovoPost(req , res) {
    const novoPost = req.body;

    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado)
    } catch(err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição"})

    }
}

async function uploadImagem(req , res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    }

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path , imagemAtualizada)
        res.status(200).json(postCriado)
    } catch(err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição"})

    }
}

async function atualizarNovoPost(req , res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)
     
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postAtualizado = await atualizarPost(id , post);
        res.status(200).json(postAtualizado)
    } catch(err) {
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição"})

    }
}

export {listarPosts, postarNovoPost , uploadImagem , atualizarNovoPost}