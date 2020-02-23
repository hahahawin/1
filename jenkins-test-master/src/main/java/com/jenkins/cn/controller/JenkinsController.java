package com.jenkins.cn.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author : asus
 * @version : 1.0
 * @Description :
 * @Date : 2018/5/24 11:03
 * @Copyright : Copyright (c) 2018 All Rights Reserved
 **/
@Controller
public class JenkinsController {

    @RequestMapping("/index")
    public String index(Model model){
        SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-DD HH:mm:ss");
        String str = format.format(new Date());
        model.addAttribute("date",str);
        return "index";
    }
}
