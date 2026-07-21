"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

export default function DeleteListButton({ listId }: { listId: number }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function handleDelete() {
    if (!confirm("Delete this list? This cannot be undone.")) return;
    setBusy(true);
    try {
      await fetch(`/api/lists/${listId}`, { method: "DELETE" });
      router.push("/account/lists");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      color="error"
      variant="outlined"
      size="small"
      startIcon={<DeleteOutlineIcon />}
      onClick={handleDelete}
      disabled={busy}
    >
      Delete List
    </Button>
  );
}
