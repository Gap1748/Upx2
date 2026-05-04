package com.upx.dto;

public class MotoristaDTO {
    private Long usuarioId;
    private String cnh;
    private String placa;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getCnh() { return cnh; }
    public void setCnh(String cnh) { this.cnh = cnh; }

    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
}