package com.beoneess.common.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MyErrorController implements ErrorController {
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request){
        //获取statusCode:401,404,500
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
//        System.out.println("statusCode:"+statusCode);
        if(statusCode == 401){
            return "/error401";
        }else if(statusCode == 404){
            return "/error404";
        }else{
            return "/error500";
        }

    }

    @Override
    public String getErrorPath() {
        return "/error";
    }
}
