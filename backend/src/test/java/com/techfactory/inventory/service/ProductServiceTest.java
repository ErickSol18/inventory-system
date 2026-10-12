package com.techfactory.inventory.service;

import com.techfactory.inventory.dto.ProductRequestDto;
import com.techfactory.inventory.dto.ProductResponseDto;
import com.techfactory.inventory.entity.Product;
import com.techfactory.inventory.exception.ResourceNotFoundException;
import com.techfactory.inventory.repository.ProductRepository;
import com.techfactory.inventory.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product sampleProduct;
    private ProductRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product(1L, "Laptop Dell", "Work laptop", new BigDecimal("1200.00"), 10, "Electrónica");
        sampleRequestDto = new ProductRequestDto("Laptop Dell", "Work laptop", new BigDecimal("1200.00"), 10, "Electrónica");
    }

    @Test
    @DisplayName("Should return all products when no filters applied")
    void getAllProducts_withoutFilters_shouldReturnList() {
        when(productRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts(null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Laptop Dell");
        verify(productRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    @DisplayName("Should return filtered products when search parameter provided")
    void getAllProducts_withSearch_shouldCallSearchProducts() {
        when(productRepository.searchProducts("laptop", null)).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts("laptop", null);

        assertThat(result).hasSize(1);
        verify(productRepository, times(1)).searchProducts("laptop", null);
    }

    @Test
    @DisplayName("Should return product by ID when product exists")
    void getProductById_whenExists_shouldReturnProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

        ProductResponseDto result = productService.getProductById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Laptop Dell");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when product does not exist")
    void getProductById_whenNotExists_shouldThrowException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found with id: '999'");
    }

    @Test
    @DisplayName("Should create product and return saved DTO")
    void createProduct_shouldSaveAndReturnDto() {
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        ProductResponseDto result = productService.createProduct(sampleRequestDto);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Laptop Dell");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should update existing product and return updated DTO")
    void updateProduct_whenExists_shouldUpdateAndReturnDto() {
        Product updatedProduct = new Product(1L, "Laptop Dell Pro", "Updated description", new BigDecimal("1300.00"), 15, "Electrónica");
        ProductRequestDto updateDto = new ProductRequestDto("Laptop Dell Pro", "Updated description", new BigDecimal("1300.00"), 15, "Electrónica");

        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductResponseDto result = productService.updateProduct(1L, updateDto);

        assertThat(result.getName()).isEqualTo("Laptop Dell Pro");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("1300.00"));
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should delete product when ID exists")
    void deleteProduct_whenExists_shouldDelete() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        doNothing().when(productRepository).delete(sampleProduct);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).delete(sampleProduct);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existing product")
    void deleteProduct_whenNotExists_shouldThrowException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct(999L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(productRepository, never()).delete(any());
    }
}
