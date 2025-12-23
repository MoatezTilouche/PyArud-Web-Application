## Quick demo sets (Good / Medium / Bad)

Use these first if you want a fast, representative run.

### Good (likely higher confidence)

```text
إِنِّي أُحِبُّ النُّورَ فِي كُلِّ الدُّجَى
وَأَرَى الأَمَلَ الْجَمِيلَ إِذَا عَزَمْتُ
```

Expected:

- Lines entered: 2
- Total verses (backend): typically 1

### Medium (valid, but stresses handling)

```text
يا صاحِ، هل تسمعُ؟ هذا اختبارٌ رقم 1!
نقطةٌ، فاصلةٌ؛ سؤالٌ؟ ثم نهاية.
```

Expected:

- Lines entered: 2
- Total verses (backend): typically 1

### Bad (intentionally problematic)

```text
سطرٌ واحدٌ فقط دونَ شطرٍ ثانٍ
```

Expected:

- Lines entered: 1
- Total verses (backend): backend-dependent (could error or return 0/1)
- If rejected: UI shows an error alert.

---

## Other small inputs (handled by the client)

Not many—just a few useful edge types.

### Extra spacing + blank lines

```text


  أكتبُ نصًّا فيه فراغاتٌ كثيرةٌ


  ثم أُكملُهُ بسطرٍ ثانٍ


```

### English-only (should not crash)

```text
This is an English-only input.
It should not crash the UI.
```

### Emoji / symbols in Arabic

```text
يا قلبُ ♥ ما ضرَّك لو صبرتَ قليلًا؟
سنمضي 🙂 رغم كلِّ ما قد أصابَنا.
```
