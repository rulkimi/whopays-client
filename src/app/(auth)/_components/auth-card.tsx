import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { Receipt } from "lucide-react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Card className="max-w-md w-full mx-auto shadow-md border rounded-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="flex items-center justify-center gap-2 text-3xl font-semibold">
          <Receipt className="text-primary" />
          <span>Whopays</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
