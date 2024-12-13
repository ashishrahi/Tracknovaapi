# How to add environment variable in IIS Server

- `Follow This Path: C:\Windows\System32\inetsrv\config.`
- Find the Application Pool option

```javascript
    <applicationPools>
        <add name="DefaultAppPool" />
            <add name="commonjsAPI" />
            <add name="workingCommonJSApi" />
            <add name="testingCommonJSApi" />
            <add name="webpack" />
            <add name="esbuild" />
            <!---- Application Name --/>
            <add name="finalHostApi" />
                <add name="envTestBackend" managedRuntimeVersion="v4.0"managedPipelineMode="Integrated">
                    <!-- <processModel ... /> -->
                    <environmentVariables>
                            <add name="DB_SERVER_NAME" value="value" />
                            <add name="DB_SERVER_PORT" value="value" />
                            <add name="DB_NAME" value="value" />
                            <add name="DB_USER" value="value" />
                            <add name="DB_PASSWORD" value="value" />
                    </environmentVariables>
            </add>
                <applicationPoolDefaults managedRuntimeVersion="v4.0">
                    <processModel identityType="ApplicationPoolIdentity" loadUserProfile="true" setProfileEnvironment="false" />
                </applicationPoolDefaults>
    </applicationPools>
```
