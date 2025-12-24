package com.ifba.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>{
    @Query("SELECT a FROM Address a WHERE " +
            "a.street = :street AND " +
            "a.district = :district AND " +
            "a.city = :city AND " +
            "a.state = :state AND " +
            "a.cep = :cep AND " +
            "(:number IS NULL OR a.number = :number) AND " +
            "(:complement IS NULL OR a.complement = :complement)")
    Address findByAddressFields(
            @Param("street") String street,
            @Param("district") String district,
            @Param("city") String city,
            @Param("state") String state,
            @Param("cep") String cep,
            @Param("number") String number,
            @Param("complement") String complement
        );
}
