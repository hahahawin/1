package com.beoneess.common.controller;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.io.StringReader;
import java.sql.*;

@MappedTypes({Object.class})
@MappedJdbcTypes(value = {JdbcType.CLOB})
public class MyTypeClobHandleCotroller extends BaseTypeHandler<Object> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        String parameterStr = (String) parameter;
        StringReader reader = new StringReader(parameterStr);
        ps.setCharacterStream(i, reader, parameterStr.length());
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = "";
        Clob clob = rs.getClob(columnName);
        if(clob != null) {
            int size = (int)clob.length();
            value = clob.getSubString(1L, size);
        }

        return value;
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = "";
        Clob clob = rs.getClob(columnIndex);
        if(clob != null) {
            int size = (int)clob.length();
            value = clob.getSubString(1L, size);
        }

        return value;
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = "";
        Clob clob = cs.getClob(columnIndex);
        if(clob != null) {
            int size = (int)clob.length();
            value = clob.getSubString(1L, size);
        }

        return value;
    }
}
