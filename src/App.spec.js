import { describe, it, expect } from "vitest";
import { schema } from "./App";

describe("App", () => {
  describe("form validation", () => {
    it("should pass validation if firstName is supplied and not nickName", async () => {
      const result = await schema.validate({
        firstName: "a",
        nickName: undefined,
      });

      expect(result.firstName).toBe("a");
    });

    it("should pass validation if nickName is supplied and not firstName", async () => {
      const result = await schema.validate({
        firstName: undefined,
        nickName: "a",
      });

      expect(result.nickName).toBe("a");
    });

    it("should fail validation if you left firstName and lastName blank", async () => {
      let error;
      try {
        await schema.validate({ firstName: undefined, nickName: undefined });
      } catch (e) {
        error = e;
      }

      expect(error.errors).toEqual([
        "you must provide either a firstName or a nickName",
      ]);
    });

    it("should fail validation if you filled in both firstName and nickName", async () => {
      let error;
      try {
        await schema.validate({ firstName: "a", nickName: "b" });
      } catch (e) {
        error = e;
      }

      expect(error.errors).toEqual([
        "you cannot provide both firstName and nickName",
      ]);
    });
  });
});
