import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { fetchReceiptById, fetchReceiptSplits } from "@/actions/receipt";
import { formatCurrency } from "@/lib/utils";
import React from "react";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ receiptId: string }> }
) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "detailed") as
    | "simple"
    | "detailed";
  const { receiptId } = await context.params;

  const [receipt, splits] = await Promise.all([
    fetchReceiptById(receiptId),
    fetchReceiptSplits(receiptId),
  ]);

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          color: "#111827",
          padding: 48,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      },
      // Header
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
            },
          },
          receipt.restaurant_name
        ),
        React.createElement(
          "div",
          { style: { fontSize: 20, color: "#6b7280" } },
          new Date(receipt.created_at).toLocaleString()
        )
      ),

      // Summary
      React.createElement(
        "div",
        {
          style: {
            borderTop: "2px dashed #9ca3af",
            marginTop: 24,
            paddingTop: 16,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              textAlign: "center",
              fontWeight: 700,
              fontSize: 28,
              paddingBottom: 8,
              borderBottom: "1px dashed #d1d5db",
            },
          },
          "SUMMARY"
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              fontSize: 20,
              marginTop: 12,
            },
          },
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "space-between" } },
            React.createElement(
              "span",
              {
                style: {
                  color: "#4b5563",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                },
              },
              "Subtotal"
            ),
            React.createElement(
              "span",
              { style: { fontWeight: 700 } },
              formatCurrency(splits.summary.subtotal, splits.currency)
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "space-between" } },
            React.createElement(
              "span",
              {
                style: {
                  color: "#4b5563",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                },
              },
              "Tax"
            ),
            React.createElement(
              "span",
              { style: { fontWeight: 700 } },
              formatCurrency(splits.summary.tax, splits.currency)
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "space-between" } },
            React.createElement(
              "span",
              {
                style: {
                  color: "#4b5563",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                },
              },
              "Service Charge"
            ),
            React.createElement(
              "span",
              { style: { fontWeight: 700 } },
              formatCurrency(splits.summary.service_charge, splits.currency)
            )
          ),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
              },
            },
            React.createElement(
              "span",
              { style: { letterSpacing: 2, textTransform: "uppercase" } },
              "Total"
            ),
            React.createElement(
              "span",
              { style: { color: "#2563eb" } },
              formatCurrency(splits.summary.total, splits.currency)
            )
          )
        )
      ),

      // Per-friend
      React.createElement(
        "div",
        {
          style: {
            borderTop: "2px dashed #9ca3af",
            marginTop: 24,
            paddingTop: 16,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              textAlign: "center",
              fontWeight: 700,
              fontSize: 28,
              paddingBottom: 8,
              borderBottom: "1px dashed #d1d5db",
            },
          },
          "PER-FRIEND TOTALS"
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 12,
            },
          },
          ...splits.totals.map((t) =>
            React.createElement(
              "div",
              {
                key: t.id,
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px dotted #d1d5db",
                  paddingBottom: 8,
                },
              },
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: 8 } },
                React.createElement(
                  "span",
                  { style: { fontWeight: 600, fontSize: 22 } },
                  t.name
                )
              ),
              React.createElement(
                "div",
                { style: { textAlign: "right" } },
                React.createElement(
                  "div",
                  { style: { fontWeight: 800, fontSize: 22 } },
                  formatCurrency(t.total, splits.currency)
                ),
                mode === "detailed"
                  ? React.createElement(
                      "div",
                      { style: { fontSize: 16, color: "#6b7280" } },
                      `${formatCurrency(
                        t.subtotal,
                        splits.currency
                      )} + ${formatCurrency(
                        t.tax,
                        splits.currency
                      )} + ${formatCurrency(t.service_charge, splits.currency)}`
                    )
                  : null
              )
            )
          )
        )
      ),

      // Items (detailed only)
      mode === "detailed"
        ? React.createElement(
            "div",
            {
              style: {
                borderTop: "2px dashed #9ca3af",
                marginTop: 24,
                paddingTop: 16,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 28,
                  paddingBottom: 8,
                  borderBottom: "1px dashed #d1d5db",
                },
              },
              "ITEMS"
            ),
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 12,
                },
              },
              ...splits.items.slice(0, 20).map((item) =>
                React.createElement(
                  "div",
                  {
                    key: item.item_id,
                    style: {
                      borderBottom: "1px dotted #d1d5db",
                      paddingBottom: 8,
                    },
                  },
                  React.createElement(
                    "div",
                    {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 20,
                        fontWeight: 600,
                      },
                    },
                    React.createElement("span", null, item.item_name),
                    React.createElement(
                      "span",
                      null,
                      formatCurrency(item.line_total, splits.currency)
                    )
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        marginLeft: 8,
                        marginTop: 4,
                        fontSize: 16,
                        color: "#4b5563",
                      },
                    },
                    ...item.friends.map((f) =>
                      React.createElement(
                        "div",
                        {
                          key: `${item.item_id}-${f.id}`,
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                          },
                        },
                        React.createElement("span", null, `• ${f.name}`),
                        React.createElement(
                          "span",
                          null,
                          formatCurrency(f.share, splits.currency)
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        : null
    ),
    { width: 1200, height: 630 }
  );
}
