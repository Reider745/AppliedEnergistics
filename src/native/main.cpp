#include <mod.h>
#include <innercore/item_registry.h>
#include <innercore/id_conversion_map.h>
#include <vtable.h>
#include <innercore_callbacks.h>
#include <java.h>
#include <vector>

std::vector<std::pair<int, bool>*> list_item_despawn;

class AppliedEnergisticsModule : public Module {
    public:
        AppliedEnergisticsModule(): Module("AppliedEnergistics") {};

        virtual void initialize(){
            Callbacks::addCallback("postModItemsInit", CALLBACK([], (), {
                for(int i = 0;i < list_item_despawn.size();i++){
                    std::pair<int, bool>* pair = list_item_despawn.at(i);

                    VTABLE_FIND_OFFSET(Item_setShouldDespawn, _ZTV4Item, _ZN4Item16setShouldDespawnEb);
                    VTABLE_CALL<void>(Item_setShouldDespawn, ItemRegistry::getItemById(IdConversion::staticToDynamic(pair->first, IdConversion::Scope::ITEM)), pair->second);
                }
            }));
        }
};

MAIN {
    new AppliedEnergisticsModule();
}

extern "C" {
    JNIEXPORT void JNICALL Java_com_reider745_appliedenergistics_Item_setShouldDespawn
	(JNIEnv* env, jclass, jint id, jboolean value) {
        list_item_despawn.push_back(new std::pair<int, bool>(id, value == JNI_TRUE));
    }
}