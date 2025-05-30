package ru.shift.server.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import ru.shift.server.services.ThymeleafService;

@Slf4j
@Controller
@RequestMapping("/mineIsNotMyself")
@RequiredArgsConstructor
public class MainController {
    private final ThymeleafService thymeleafService;

    @GetMapping
    public ModelAndView index(ModelAndView modelAndView,
                              @CookieValue(value = "token", required = false) String token) {
        modelAndView.setViewName("index");
        thymeleafService.htmlAddUserJwtInfo(modelAndView, token);
        return modelAndView;
    }

    @GetMapping("registration")
    public ModelAndView singUp(ModelAndView modelAndView) {
        modelAndView.setViewName("signup");
        return modelAndView;
    }

    @GetMapping("authorization")
    public ModelAndView singIn(ModelAndView modelAndView) {
        modelAndView.setViewName("signin");
        return modelAndView;
    }

    @GetMapping("adminPanel")
    public ModelAndView adminPanelRegistration(ModelAndView modelAndView) {
        modelAndView.setViewName("");
        return modelAndView;
    }

    @GetMapping("/orderFrom")
    public ModelAndView orderFrom(ModelAndView modelAndView) {
        modelAndView.setViewName("order-form");
        return modelAndView;
    }
}
