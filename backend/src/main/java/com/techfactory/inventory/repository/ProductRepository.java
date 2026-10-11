package com.techfactory.inventory.repository;

import com.techfactory.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByCreatedAtDesc();

    List<Product> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);

    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "ORDER BY p.id DESC")
    List<Product> searchProducts(@Param("search") String search, @Param("category") String category);
}
