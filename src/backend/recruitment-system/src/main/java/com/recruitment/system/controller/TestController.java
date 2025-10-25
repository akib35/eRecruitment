package com.recruitment.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/test-public")
    public String testPublic() {
        return "This is a public endpoint";
    }
}
