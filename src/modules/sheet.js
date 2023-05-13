import jwt from "jsonwebtoken";
import axios from "axios";

class GoogleSheetHelper {
  #googleApisIss
  #googleApisPrivateKey
  #googleApisBaseUrl

  constructor(googleApisIss, googleApisPrivateKey) {
    this.#googleApisIss = googleApisIss
    this.#googleApisPrivateKey = googleApisPrivateKey
    this.#googleApisBaseUrl = "https://sheets.googleapis.com/v4"
  }

  generateToken() {
    try {
      const token = jwt.sign(
        {
          iss: this.#googleApisIss,
          scope: "https://www.googleapis.com/auth/spreadsheets",
          aud: "https://oauth2.googleapis.com/token",
        },
        this.#googleApisPrivateKey,
        {
          algorithm: "RS256",
          expiresIn: "1h",
        }
      );

      return token;
    } catch (err) {
      throw err;
    }
  }

  async getAccessToken() {
    try {
      const token = this.generateToken();

      const { data } = await axios({
        method: "POST",
        url: `https://oauth2.googleapis.com/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`,
      });

      const access_token = data.access_token.split("...")[0];
      return access_token;
    } catch (err) {
      throw err;
    }
  }

  async get(sheetId, sheetName, range) {
    try {
      const access_token = await this.getAccessToken();
      const { data } = await axios({
        url: `${this.#googleApisBaseUrl}/spreadsheets/${sheetId}/values/${sheetName}!${range}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  async batchUpdate(sheetId, sheetName, range, values) {
    try {
      const access_token = await this.getAccessToken();

      const { data } = await axios({
        method: "POST",
        url: `${this.#googleApisBaseUrl}/spreadsheets/${sheetId}/values:batchUpdate`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          valueInputOption: "RAW",
          data: [
            {
              range: `${sheetName}!${range}`,
              values,
            },
          ],
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  async append(sheetId, sheetName, range, values) {
    try {
      const access_token = await this.getAccessToken();
      const { data } = await axios({
        method: "POST",
        url: `${this.#googleApisBaseUrl}/spreadsheets/${sheetId}/values/${sheetName}:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          range: `${sheetName}`,
          majorDimension: "ROWS",
          values,
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }
}

export default GoogleSheetHelper