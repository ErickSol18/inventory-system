package com.techfactory.inventory.service;

import com.techfactory.inventory.dto.ProductRequestDto;
import com.techfactory.inventory.dto.ProductResponseDto;

import java.util.List;

public interface ProductService {

    List<ProductResponseDto> getAllProducts(String search, String category);

    ProductResponseDto getProductById(Long id);

    ProductResponseDto createProduct(ProductRequestDto requestDto);

    ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto);

    void deleteProduct(Long id);
}
