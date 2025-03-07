package com.github.dolmitya.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RegistrationResponse(
        @JsonProperty("username") String username
) {
}
