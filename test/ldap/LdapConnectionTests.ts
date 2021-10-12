/* eslint-disable no-unused-expressions */
import {describe, it} from "mocha";
import {expect} from "chai";
import {LdapConnection} from "../../src/ldap/LdapConnection";
import {ConfigUtil} from "../../src/utils/ConfigUtil";

describe("ldap", () => {
    describe("LdapConnection", () => {
        before(() => {
            ConfigUtil.setup();
        });
        describe("checkUser", () => {
            it("should check a user successfully", async () => {
                // assumes the LDAP server is running, see docker-compose.yml
                const connection = new LdapConnection(ConfigUtil.getLdapConnectionSettings());
                const result = await connection.checkUser("cn=user01,ou=users,dc=example,dc=org", "password1");
                expect(result.success).to.be.true;
            }).timeout(5000);
            it("should not check a user successfully", async () => {
                // assumes the LDAP server is running, see docker-compose.yml
                const connection = new LdapConnection(ConfigUtil.getLdapConnectionSettings());
                const result = await connection.checkUser("cn=user01,ou=users,dc=example,dc=org", "password2");
                expect(result.success).to.be.false;
                expect(result.error?.message).to.equal("Invalid credentials during a bind operation. Code: 0x31");
            }).timeout(5000);
        });
    });
});
