-- Replace placeholder sizes with real values. Only touches rows still showing a placeholder.
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"9 × 8.5 cm, 350 ml"') WHERE "slug" = 'stoneware-mug' AND "details"->>'size' LIKE '%[%';--> statement-breakpoint
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"45 × 20 cm"') WHERE "slug" = 'iroko-serving-board' AND "details"->>'size' LIKE '%[%';--> statement-breakpoint
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"70 × 50 cm each"') WHERE "slug" = 'linen-tea-towels-pair' AND "details"->>'size' LIKE '%[%';--> statement-breakpoint
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"6 cm tall, 4 cm deep"') WHERE "slug" = 'brass-wall-hooks-pair' AND "details"->>'size' LIKE '%[%';--> statement-breakpoint
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"5 litres · 32 × 24 cm"') WHERE "slug" = 'clay-water-pot' AND "details"->>'size' LIKE '%[%';--> statement-breakpoint
UPDATE "products" SET "details" = jsonb_set("details", '{size}', '"30 cm across"') WHERE "slug" = 'woven-bread-basket' AND "details"->>'size' LIKE '%[%';
