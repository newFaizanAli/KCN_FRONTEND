import { ReactNode } from "react";

const Table = ({ children, className }: {
    children: ReactNode,
    className?: string
}) => {
    return <table className={`min-w-full  ${className}`}>{children}</table>;
};

const TableHeader = ({ children, className }: {
    children: ReactNode,
    className?: string
}) => {
    return <thead className={className}>{children}</thead>;
};

const TableBody = ({ children, className }: {
    children: ReactNode,
    className?: string
}) => {
    return <tbody className={className}>{children}</tbody>;
};

const TableRow = ({ children, className }: {
    children: ReactNode,
    className?: string
}) => {
    return <tr className={className}>{children}</tr>;
};

const TableCell = ({
    children,
    isHeader = false,
    className,
}: {
    children: ReactNode,
    isHeader?: boolean,
    className?: string
}) => {
    const CellTag = isHeader ? "th" : "td";
    return <CellTag className={` ${className} text-gray-800 dark:text-white/90`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };