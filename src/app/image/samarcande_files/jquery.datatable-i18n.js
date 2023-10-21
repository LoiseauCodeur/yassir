(function ($) {
    $.extend($.fn.dataTable.defaults.oLanguage, {
        "sProcessing": "${DATAGRID_PROCESSING}",
        "sSearch": "${DATAGRID_SEARCH}",
        "sLengthMenu": "${DATAGRID_LENGTH_MENU}",
        "sInfo": "${DATAGRID_INFO}",
        "sInfoEmpty": "",
        "sInfoFiltered": "${DATAGRID_INFO_FILTER}",
        "sInfoPostFix": "${DATAGRID_INFO_POSTFIX}",
        "sLoadingRecords": "${DATAGRID_LOADING_RECORDS}",
        "sZeroRecords": "${DATAGRID_ZERO_RECORDS}",
        "sEmptyTable": "${DATAGRID_EMPTY_TABLE}",
        "oPaginate": {
            "sFirst": "${DATAGRID_PAGINATE_FIRST}",
            "sPrevious": "${DATAGRID_PAGINATE_PREVIOUS}",
            "sNext": "${DATAGRID_PAGINATE_NEXT}",
            "sLast": "${DATAGRID_PAGINATE_LAST}"
        },
        "oAria": {
            "sSortAscending": "${DATAGRID_ARIA_SORT_ASCENDING}",
            "sSortDescending": "${DATAGRID_ARIA_SORT_DESCENDING}"
        }
    });
})(jQuery);