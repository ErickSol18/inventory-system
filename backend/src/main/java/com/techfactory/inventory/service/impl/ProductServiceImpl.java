package com.techfactory.inventory.service.impl;

import com.techfactory.inventory.dto.ProductRequestDto;
import com.techfactory.inventory.dto.ProductResponseDto;
import com.techfactory.inventory.entity.Product;
import com.techfactory.inventory.exception.ResourceNotFoundException;
import com.techfactory.inventory.repository.ProductRepository;
import com.techfactory.inventory.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts(String search, String category) {
        log.info("Fetching products - search: '{}', category: '{}'", search, category);

        List<Product> products;
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL"))
                ? category.trim()
                : null;

        if (cleanSearch == null && cleanCategory == null) {
            products = productRepository.findAllByOrderByCreatedAtDesc();
        } else {
            products = productRepository.searchProducts(cleanSearch, cleanCategory);
        }

        return products.stream()
                .map(ProductResponseDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        log.info("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductResponseDto.fromEntity(product);
    }

    @Override
    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto requestDto) {
        log.info("Creating new product with name: {}", requestDto.getName());

        Product product = new Product();
        product.setName(requestDto.getName().trim());
        product.setDescription(requestDto.getDescription() != null ? requestDto.getDescription().trim() : null);
        product.setPrice(requestDto.getPrice());
        product.setStock(requestDto.getStock());
        product.setCategory(requestDto.getCategory() != null ? requestDto.getCategory().trim() : null);

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());
        return ProductResponseDto.fromEntity(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto) {
        log.info("Updating product with id: {}", id);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        existingProduct.setName(requestDto.getName().trim());
        existingProduct.setDescription(requestDto.getDescription() != null ? requestDto.getDescription().trim() : null);
        existingProduct.setPrice(requestDto.getPrice());
        existingProduct.setStock(requestDto.getStock());
        existingProduct.setCategory(requestDto.getCategory() != null ? requestDto.getCategory().trim() : null);

        Product updatedProduct = productRepository.save(existingProduct);
        log.info("Product updated successfully with id: {}", updatedProduct.getId());
        return ProductResponseDto.fromEntity(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        productRepository.delete(existingProduct);
        log.info("Product with id: {} deleted successfully", id);
    }
}
