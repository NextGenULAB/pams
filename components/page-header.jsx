import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const PageHeader = ({
  icon,
  title,
  backlink = "/",
  backLabel = "Back to Home",
}) => {
  return (
    <div className="flex flex-col justify-between gap-5 mb-8">
      <Link href={backlink}>
        <Button
          variant="outline"
          size="sm"
          className="mb-2 border-b-emerald-900/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLabel}
        </Button>
      </Link>

      <div className="flex items-end gap-2">
        {icon && (
          <div className=" text-emerald-500">
            {React.cloneElement(icon, {
              className:"h-12 md:h-14 w-12 md:w-14",
            })}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl gradient-title">{title}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
