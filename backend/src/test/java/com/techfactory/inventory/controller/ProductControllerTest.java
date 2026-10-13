package com.techfactory.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techfactory.inventory.dto.ProductRequestDto;
import com.techfactory.inventory.dto.ProductResponseDto;
import com.techfactory.inventory.exception.ResourceNotFoundException;
import com.techfactory.inventory.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("GET /api/products should return 200 OK and list of products")
    void getAllProducts_shouldReturn200() throws Exception {
        ProductResponseDto dto = new ProductResponseDto(
                1L, "Mouse Gamer", "RGB Mouse", new BigDecimal("49.99"), 20, "Electrónica", Instant.now(), Instant.now()
        );
        when(productService.getAllProducts(null, null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Mouse Gamer"))
                .andExpect(jsonPath("$[0].price").value(49.99));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 200 OK when found")
    void getProductById_whenFound_shouldReturn200() throws Exception {
        ProductResponseDto dto = new ProductResponseDto(
                1L, "Teclado", "Mecánico", new BigDecimal("79.99"), 5, "Electrónica", Instant.now(), Instant.now()
        );
        when(productService.getProductById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Teclado"));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 404 Not Found when missing")
    void getProductById_whenNotFound_shouldReturn404() throws Exception {
        when(productService.getProductById(999L)).thenThrow(new ResourceNotFoundException("Product", "id", 999L));

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Product not found with id: '999'"));
    }

    @Test
    @DisplayName("POST /api/products should return 201 Created on valid input")
    void createProduct_whenValid_shouldReturn201() throws Exception {
        ProductRequestDto requestDto = new ProductRequestDto("Monitor 27", "4K HDR", new BigDecimal("299.99"), 8, "Electrónica");
        ProductResponseDto responseDto = new ProductResponseDto(
                1L, "Monitor 27", "4K HDR", new BigDecimal("299.99"), 8, "Electrónica", Instant.now(), Instant.now()
        );

        when(productService.createProduct(any(ProductRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Monitor 27"));
    }

    @Test
    @DisplayName("POST /api/products should return 400 Bad Request on blank name and negative price")
    void createProduct_whenInvalid_shouldReturn400() throws Exception {
        ProductRequestDto invalidDto = new ProductRequestDto("", "Bad product", new BigDecimal("-10.00"), -1, "Electrónica");

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.price").exists())
                .andExpect(jsonPath("$.validationErrors.stock").exists());
    }

    @Test
    @DisplayName("PUT /api/products/{id} should return 200 OK on successful update")
    void updateProduct_whenValid_shouldReturn200() throws Exception {
        ProductRequestDto requestDto = new ProductRequestDto("Monitor 32", "4K Ultra", new BigDecimal("399.99"), 5, "Electrónica");
        ProductResponseDto responseDto = new ProductResponseDto(
                1L, "Monitor 32", "4K Ultra", new BigDecimal("399.99"), 5, "Electrónica", Instant.now(), Instant.now()
        );

        when(productService.updateProduct(eq(1L), any(ProductRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Monitor 32"));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} should return 204 No Content")
    void deleteProduct_shouldReturn204() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(1L);
    }
}
