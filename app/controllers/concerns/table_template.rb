module TableTemplate # book keeping registry for plugins
    extend ActiveSupport::Concern

    def index # generates the controller index action 
        # for each provider: columns += provider.columns
        # columns = reduce_providers { |provider| provider.columns }.sort_by_weight
        # return {
        # json: { columns: columns,
            # rows: resource_base_search_and_page.map { |resource| 
            #   registry.providers.map({|provider|
            #       cells: provider.cells(resource), actions: provider.actions(resource)
            #   }).flatten.sort_by_weight
            #}  }
        #}
    end

    def columns
        []
    end

    module ClassMethods
        def table_template_providers
          @table_template_providers ||= []
        end

        def register_template_provider(provider) # called from engine
          table_template_providers << provider
        end

        def reduce_providers
            @table_template_providers.map do |provider|
                yield(provider.new) # we need a default provider for controller
            end + [yield(self)]
        end
    end
end