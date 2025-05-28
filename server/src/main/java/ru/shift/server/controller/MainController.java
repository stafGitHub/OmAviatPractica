package ru.shift.server.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Controller
@RequestMapping("/mineIsNotMyself")
public class MainController {
    @GetMapping
    public ModelAndView index(ModelAndView modelAndView) {
        modelAndView.setViewName("index");
        return modelAndView;
    }

    @GetMapping("registration")
    public ModelAndView register(ModelAndView modelAndView) {
        modelAndView.setViewName("registration");
        return modelAndView;
    }

    @GetMapping("authorization")
    public ModelAndView authorization(ModelAndView modelAndView) {
        modelAndView.setViewName("authorization");
        return modelAndView;
    }
}
