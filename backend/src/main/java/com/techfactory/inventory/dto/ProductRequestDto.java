package com.techfactory.inventory.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Schema(description = "Payload for creating or updating a product")
public class ProductRequestDto {

    @Schema(description = "Product name", example = "Laptop Dell XPS 15", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Product name is required and cannot be blank")
    @Size(max = 150, message = "Product name must not exceed 150 characters")
    private String name;

    @Schema(description = "Product description", example = "High-performance laptop for software development")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Schema(description = "Product unit price (must be greater than 0)", example = "1499.99", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Product price is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Price must be greater than 0")
    private BigDecimal price;

    @Schema(description = "Available inventory stock (must be 0 or greater)", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Product stock is required")
    @Min(value = 0, message = "Stock must be greater than or equal to 0")
    private Integer stock;

    @Schema(description = "Product category", example = "Electrónica")
    @Size(max = 80, message = "Category must not exceed 80 characters")
    private String category;

    public ProductRequestDto() {
    }

    public ProductRequestDto(String name, String description, BigDecimal price, Integer stock, String category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
