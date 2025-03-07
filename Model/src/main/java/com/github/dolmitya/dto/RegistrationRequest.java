package com.github.dolmitya.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public record RegistrationRequest(
        @NotNull
        @JsonProperty("username") String username,

        @NotNull
        @JsonProperty("password") String password
) {
}
