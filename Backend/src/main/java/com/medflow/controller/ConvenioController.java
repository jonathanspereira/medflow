package com.medflow.controller;

import com.medflow.model.Convenio;
import com.medflow.service.ConvenioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/convenios")
public class ConvenioController {

    @Autowired
    private ConvenioService convenioService;

    // Listar todos os convênios
    @GetMapping
    public List<Convenio> listarConvenios() {
        List<Convenio> convenios = convenioService.listarTodosConvenios();
        convenios.forEach(convenio -> System.out.println(convenio.toString()));
        return convenios;
    }

    // Criar um novo convenio
    @PostMapping
    public Convenio criarConvenio(@RequestBody Convenio novoConvenio) {
        // Definir data de criação atual
        novoConvenio.setDataCriacao(LocalDateTime.now());

        // Converter o nome do convênio para maiúsculas (ou outro campo desejado)
        if (novoConvenio.getDescricao() != null) {
            novoConvenio.setDescricao(novoConvenio.getDescricao().toUpperCase());
        }

        // Salvar o convênio
        Convenio convenioCriado = convenioService.salvarConvenio(novoConvenio);

        // Exibir o convenio criado no console
        System.out.println("Convenio criado: " + convenioCriado.toString());

        return convenioCriado;
    }

    // Atualizar um convenio
    @PutMapping("/{id}")
    public Convenio atualizarConvenio(@PathVariable Long id, @RequestBody Convenio convenioAtualizado) {
        // Buscar o convenio pelo ID
        Convenio convenioExistente = convenioService.buscarPorId(id).orElse(null);

        // Se o convenio existir, atualizar os campos
        if (convenioExistente != null) {
            convenioExistente.setDescricao(convenioAtualizado.getDescricao());
            convenioExistente.setDataCriacao(convenioAtualizado.getDataCriacao());

            // Salvar o convenio atualizado
            Convenio convenioAtualizadoSalvo = convenioService.salvarConvenio(convenioExistente);

            // Exibir o convenio atualizado no console
            System.out.println("Convenio atualizado: " + convenioAtualizadoSalvo.toString());

            return convenioAtualizadoSalvo;
        }

        return null;
    }
}
