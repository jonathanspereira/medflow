package com.medflow.controller;

import com.medflow.model.Convenio;
import com.medflow.service.ConvenioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/convenios")
public class ConvenioController {

    @Autowired
    private ConvenioService convenioService;

    @GetMapping
    public List<Convenio> listarConvenios() {
        List<Convenio> convenios = convenioService.listarTodosConvenios();

        // Exibir convenios no console (como "print")
        convenios.forEach(convenio -> System.out.println(convenio.toString()));

        return convenios;
    }
}
