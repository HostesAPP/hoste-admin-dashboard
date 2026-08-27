import {  Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PageHeaderLayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const PageHeaderLayout = ({ title, description, children }: PageHeaderLayoutProps) => {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-border px-6 py-3 ">

      {/* Header  */}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>

      {/* Actions (search, filters, buttons) */}
      <div className="flex items-center gap-2">
        {children}
      </div>

      {/* notification icon and user profile (will be replaced in final version) */}
      <div className="flex items-center gap-6">
        {/* notification icon */}
        <div className="p-2 hover:bg-muted rounded-lg text-muted-foreground cursor-pointer transition-colors duration-200">
          <Bell size={20}/>
        </div>
        {/* user profile */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="user.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="w-full h-full flex flex-col items-start justify-center">
            <h3 className="font-medium text-sm">John Doe</h3>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};