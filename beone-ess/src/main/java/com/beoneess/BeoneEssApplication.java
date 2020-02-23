package com.beoneess;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@MapperScan("com.beoneess.**")
@ServletComponentScan
public class BeoneEssApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BeoneEssApplication.class, args);
    }

}
